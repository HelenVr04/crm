import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { PedidoService } from '../../services/pedido.service';


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
  mensajesService: any;


  constructor(private clienteService: ClienteService,   private pedidoService: PedidoService) {
    this.getClientes();
  }


  async getClientes(): Promise<void>{
    this.clientes = await firstValueFrom(this.clienteService.getClientes());
  }

  async insertarCliente() {
    if (!this.validarCliente()) return;
    await this.clienteService.agregarCliente(this.cliente);
    this.getClientes();
    this.cliente = new Cliente();
  }

  selectCliente(clienteSeleccionado: Cliente) {
    this.cliente = clienteSeleccionado;
  }

  async updateCliente() {
    if (!this.validarCliente()) return;
    await this.clienteService.modificarCliente(this.cliente);
    this.getClientes();
    this.cliente = new Cliente();
  }

  async deleteCliente() {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este cliente?');
    if (confirmacion) {
      await this.clienteService.eliminarCliente(this.cliente);
      this.getClientes();
      this.cliente = new Cliente();
    }
  }

  /*formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX');
  }*/
    verHistorial(cliente: Cliente) {
      this.clienteSeleccionado = cliente; 
      this.pedidoService.getPedidosPorCliente(cliente.id).subscribe(pedidos => {
        this.historialPedidos = pedidos;
        this.mostrarModal = true;
      });
    }
    cerrarModal() {
      this.mostrarModal = false;
    }    
    
    recordarPago(cliente: Cliente) {
      const mensaje = `Hola ${cliente.nombre}, recuerda que tienes un pago pendiente. ¡Gracias!`;
      this.mensajesService.enviarMensaje(cliente.telefono, mensaje).subscribe({
        next: () => console.log('Recordatorio enviado'),
        error: (err: any) => console.error('Error al enviar recordatorio', err)
      });
    }
    ngOnInit() {
      this.clienteService.getClientes().subscribe((clientes: any[]) => {
        const hoy = new Date().toISOString().slice(5, 10); // "MM-DD"
        clientes.forEach(cliente => {
          const cumple = cliente.fechaNacimiento?.slice(5, 10);
          if (cumple === hoy) {
            const mensaje = `¡Feliz cumpleaños ${cliente.nombre}! Te damos un 10% de descuento 🎉`;
            this.mensajesService.enviarMensaje(cliente.telefono, mensaje).subscribe({
              next: () => console.log('Felicidades enviadas 🎂'),
              error: (err: any) => console.error('Error al enviar mensaje', err)
            });
          }
        });
      });
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
    return true;
  }
}
