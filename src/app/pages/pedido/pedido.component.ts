import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Pedido } from '../../models/pedido.model';
import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';  
import { PedidoService } from '../../services/pedido.service';
import { Producto } from '../../models/producto.model';
import { Cliente } from '../../models/cliente.model';
import { MensajesService } from '../../services/mensajes.service';


@Component({
  selector: 'app-pedido',
  imports: [FormsModule],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent {
  pedidos: Pedido[] = [];
  productos: any[] = [];
  clientes: any[] = [];
  productoSeleccionado: Producto | null = null;
  cantidadSeleccionada: number = 1;
  mensaje='';
  telefonoCli: string[] = [];

  
  pedido = new Pedido();

  constructor(
    private clienteService: ClienteService,
    private productoService: ProductoService, 
    private pedidoService: PedidoService,
    private mensajesService: MensajesService
  ) {
    this.getClientes();
    this.getProductos();
    this.getPedidos();
    this.pedido.productos = []; 
  
  }

  // Obtener los clientes
  async getClientes(): Promise<void> {
    this.clientes = await firstValueFrom(this.clienteService.getClientes());
    console.log(this.clientes);
    
    // Aquí puedes recorrer todos los clientes y guardar el teléfono si lo necesitas para más adelante
    this.telefonoCli = this.clientes.map(cliente => cliente.telefono);
    console.log("Teléfonos de clientes:", this.telefonoCli);
  }
    
  // Obtener los productos
  async getProductos(): Promise<void> {
    this.productos = await firstValueFrom(this.productoService.getProductos());  // Asegúrate de tener este servicio
  }
 //obtener pedidos 
  async getPedidos(): Promise<void> {
    const pedidosObtenidos = await firstValueFrom(this.pedidoService.getPedidos());
      this.pedidos = pedidosObtenidos.map((doc: any) => {
      return {
        id: doc.id || '',
        clienteId: doc.clienteId || '',
        clienteNombre: doc.clienteNombre || '',
        clienteTelefono: doc.clienteTelefono || '',
        fechaPedido: doc.fechaPedido || '',
        productos: doc.productos || [],
        totalCosto: doc.totalCosto || 0,
        estado: doc.estado || '',
        pagado: doc.pagado ?? false,
      } as Pedido;
    });
  
    this.pedidos.sort((a, b) => {
      return new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime();
    });
  
    console.log(this.pedidos);
  } 


  //insertar pedidos
  async insertarPedido() {
    if (!this.validarPedido()) return;
  
    const clienteSeleccionado = this.clientes.find(cliente => cliente.id === this.pedido.clienteId);
    if (clienteSeleccionado) {
      this.pedido.clienteNombre = clienteSeleccionado.nombre;
      this.pedido.clienteTelefono = clienteSeleccionado.telefono;
    }
  
    await this.pedidoService.agregarPedido(this.pedido);
  
    this.getPedidos();
    this.pedido = new Pedido();
    this.pedido.productos = [];
    this.productoSeleccionado = null;
    this.cantidadSeleccionada = 1;
  }
  
  
  //recordar pago
recordarPago(clienteTelefono: string, clienteNombre: string) {
  if (!clienteTelefono) {
    alert('❌ El cliente no tiene número de teléfono registrado');
    return;
  }
  let telefonoFormateado = clienteTelefono; // <- usar el que viene del parámetro
  if (!telefonoFormateado.startsWith('+')) {
    telefonoFormateado = '+52' + telefonoFormateado;
    console.log(telefonoFormateado);
    
  }
  const mensaje = `Hola ${clienteNombre}, esperamos que te encuentres muy bien 😊 Solo queríamos recordarte que tienes un pago pendiente con Vidrios y Aluminios de México (VAM). Si ya realizaste el pago, por favor ignora este mensaje. ¡Gracias por tu preferencia! 🙌`;
  this.mensajesService.enviarMensaje(telefonoFormateado, mensaje).subscribe({
    next: () => alert('✅ Recordatorio enviado por WhatsApp'),
    error: err => {
      console.error('❌ Error al enviar recordatorio:', err);
      alert('❌ Error al enviar recordatorio');
    }
  });
}

  
  // Seleccionar un pedido
  selectPedido(pedidoSeleccionado: Pedido) {
    this.pedido = pedidoSeleccionado;
  }

  // Modificar un pedido
  async updatePedido() {
    if (!this.validarPedido()) return;
    await this.pedidoService.modificarPedido(this.pedido);
    this.getPedidos();
    this.pedido = new Pedido();
  }

  // Eliminar un pedido
  async deletePedido() {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este pedido?');
    if (confirmacion) {
      await this.pedidoService.eliminarPedido(this.pedido);
      this.getPedidos();
      this.pedido = new Pedido();
    }
  }

  // Validar datos del pedido
  validarPedido(): boolean {
    if (!this.pedido.clienteId) {
      alert("Debe seleccionar un cliente para el pedido");
      return false;
    }
    if (!this.pedido.productos || this.pedido.productos.length === 0) {
      alert("Debe seleccionar al menos un producto");
      return false;
    }
    if (!this.pedido.fechaPedido) {
      alert("Debe seleccionar la fecha del pedido");
      return false;
    }
    if(!this.pedido.productos){
      alert("Debe seleccionar al menos un producto para el pedido");
      return false;
    }
    return true;
  }

  // Añadir productos al pedido
async addProducto() {
  if (this.productoSeleccionado && this.cantidadSeleccionada <= this.productoSeleccionado.stock) {
    const productoExistente = this.pedido.productos.find(
        (p) => p.productoId === this.productoSeleccionado?.id
    );
    if (productoExistente) {
        // Si ya existe el producto en el pedido, solo actualiza la cantidad
        productoExistente.cantidad += this.cantidadSeleccionada;
    } else {
        // Si el producto no existe, lo agrega al pedido
        this.pedido.productos.push({
            productoId: this.productoSeleccionado.id,
            nombre: this.productoSeleccionado.nombre,
            costo: this.productoSeleccionado.costo,
            cantidad: this.cantidadSeleccionada
        });
    }

    // Actualizamos el stock después de agregar el producto
    await this.productoService.actualizarStock(this.productoSeleccionado.id, this.cantidadSeleccionada);

    this.calcularTotalCosto();
    // Reiniciar la cantidad seleccionada para el siguiente producto
    this.cantidadSeleccionada = 1;
  } else {
    alert("No hay suficiente stock para este producto");
  }
}


// Validar la cantidad ingresada
validarCantidad() {
  if (this.productoSeleccionado && this.cantidadSeleccionada > this.productoSeleccionado.stock) {
    alert(`La cantidad no puede superar el stock disponible: ${this.productoSeleccionado.stock}`);
    this.cantidadSeleccionada = this.productoSeleccionado.stock;
  }
}

// Actualizar el precio cuando se seleccione un producto
updateCosto() {
  if (this.productoSeleccionado) {
    this.productoSeleccionado.costo = this.productoSeleccionado.costo;
  }
}
  // Calcular el costo total del pedido
  calcularTotalCosto() {
    this.pedido.totalCosto = this.pedido.productos.reduce((total, producto) => {
      return total + (producto.costo * producto.cantidad);
    }, 0);
  }
// Función para actualizar solo el estado y el campo "pagado" del pedido
updatePagado(pedidoSeleccionado: Pedido) {
  // Si se seleccionó un pedido, solo actualiza el estado y pagado
  const pedidoActualizado = {
    ...pedidoSeleccionado,
    estado: pedidoSeleccionado.estado,
    pagado: pedidoSeleccionado.pagado
  };

  // Actualiza Firestore con el estado y pagado
  this.pedidoService.modificarPedido(pedidoActualizado).then(() => {
    console.log('Pedido actualizado');
    this.getPedidos(); // Refrescar la lista de pedidos
  }).catch(error => {
    console.error("Error al actualizar el pedido:", error);
  });

}


 
}
