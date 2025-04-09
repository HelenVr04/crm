import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { PedidoService } from '../../services/pedido.service';
import { MensajesService } from '../../services/mensajes.service';


@Component({
  selector: 'app-cliente',
  imports: [FormsModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {
  clientes: any;
  cliente = new Cliente();
  clienteSeleccionado: Cliente = new Cliente();
  diasDelMes: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  historialPedidos: any[] = [];
  mostrarModal: boolean = false;
  mostrarFormulario: boolean = false;



  constructor(private clienteService: ClienteService,   private pedidoService: PedidoService,   private mensajesService: MensajesService // <-- Agrega esto
  ) {
    this.getClientes();
  }

  // Método para mostrar el formulario (modal)
  mostrarFormularioCliente(): void {
    this.mostrarFormulario = true;
  }

  // Método para ocultar el formulario (modal)
  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  async getClientes(): Promise<void>{
    this.clientes = await firstValueFrom(this.clienteService.getClientes());
  }

  async insertarCliente() {
    if (!this.validarCliente()) return;
    await this.clienteService.agregarCliente(this.cliente);
    this.getClientes();
    this.cliente = new Cliente();
    console.log('Cliente agregado/modificado', this.cliente);
    this.cerrarFormulario(); // Cerrar el formulario después de agregar/modificar
  }

  selectCliente(clienteSeleccionado: Cliente) {
    this.cliente = clienteSeleccionado;
    this.mostrarFormulario = true;  // Mostrar el formulario

  }

  async updateCliente() {
    if (!this.validarCliente()) return;
    await this.clienteService.modificarCliente(this.cliente);
    this.getClientes();
    this.cliente = new Cliente();
    console.log('Cliente agregado/modificado', this.cliente);
    this.cerrarFormulario(); // Cerrar el formulario después de agregar/modificar
  }

  async deleteCliente() {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este cliente?');
    if (confirmacion) {
      await this.clienteService.eliminarCliente(this.cliente);
      this.getClientes();
      this.cliente = new Cliente();
      console.log('Cliente agregado/modificado', this.cliente);
    this.cerrarFormulario(); // Cerrar el formulario después de agregar/modificar
    }
  }

  /*formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX');
  }*/
    verHistorial(cliente: Cliente) {
      this.clienteSeleccionado = cliente;
      this.pedidoService.getPedidosPorCliente(cliente.id).subscribe(pedidos => {
        this.historialPedidos = pedidos;
        console.log('Pedidos obtenidos:', pedidos);  // Verifica que los pedidos sean correctos.
        this.mostrarModal = true;
        console.log('mostrarModal:', this.mostrarModal);  // Verifica si mostrarModal se actualiza
      });
    }
    
    
    cerrarModal() {
      this.mostrarModal = false;
    }    
    

  validarCliente(): boolean {
    if (!this.cliente.nombre || this.cliente.nombre.trim().length < 7) {
      alert("Debe registrar el nombre COMPLETO del cliente");
      return false;
    }
    if (!this.cliente.telefono || !/^\d{10}$/.test(this.cliente.telefono)) {
      alert("El teléfono es obligatorio y debe contener 10 dígitos");
      return false;
    }
    if (!this.cliente.calle?.trim()) {
      alert("Debe registrar la calle del cliente");
      return false;
    }
    if (!this.cliente.ciudad?.trim()) {
      alert("Debe registrar la ciudad del cliente");
      return false;
    }
    if (!this.cliente.codigoPostal?.trim()) {
      alert("Debe registrar el código postal del cliente");
      return false;
    }
    if (!this.cliente.fechaCumpleanios || !Date.parse(this.cliente.fechaCumpleanios)) {
      alert("La fecha de cumpleaños es obligatoria");
      return false;
    }
    if (!this.cliente.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.cliente.correo)) {
      alert("El correo electrónico no tiene un formato válido");
      return false;
    }
    
    return true;
  }
}