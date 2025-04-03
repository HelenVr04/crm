import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProductoService } from '../../services/producto.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Producto } from '../../models/producto.model';
import { ProveedorComponent } from '../proveedor/proveedor.component';

@Component({
  selector: 'app-producto',
  imports: [FormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  productos: any;
  producto: Producto = new Producto();
  categorias: string[] = ['Vidrios', 'Aluminios', 'Accesorios'];
  notificaciones: Producto[] = [];
  proveedores: any[]= [];

  constructor(private productoService: ProductoService, private proveedorService: ProveedorService) {
      this.getProveedores();
      this.getProductos();
  }

  //obtener proveedores 
  async getProveedores(): Promise<void> {
    this.proveedores = await firstValueFrom(this.proveedorService.getProvedores());
  }
  async getProductos(): Promise<void> {
    try {
      const productosData = await firstValueFrom(this.productoService.getProductos());
      this.productos = productosData || []; // Asegurarnos de que sea un array
      this.checkStockBajo(); // Verificar los productos con stock bajo
    } catch (error) {
      console.error("Error al obtener productos:", error);
      this.productos = [];
    }
  }
  checkStockBajo(): void {
    if (!Array.isArray(this.productos)) {
      this.notificaciones = [];
      return;
    }
    this.notificaciones = this.productos.filter((producto: Producto) => {
      return producto.stock <= producto.alertaBaja;
    });
  }
  
  
  async insertarProducto() {
    if (!this.validarProducto()) return;
    this.producto.alertaBaja = this.producto.alertaBaja ?? 10; 
    await this.productoService.agregarProducto(this.producto);
    this.getProductos();
    this.producto = new Producto();
  }
  

  selectProducto(productoSeleccionado: Producto) {
    this.producto = productoSeleccionado;
  }

  async updateProducto() {
    if (!this.validarProducto()) return;
    await this.productoService.modificarProducto(this.producto);
    this.getProductos();
    this.producto = new Producto();
  }

  async deleteProducto() {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (confirmacion) {
      await this.productoService.eliminarProducto(this.producto);
      this.getProductos();
      this.producto = new Producto();
    }
  }

  validarProducto(): boolean {
    if (!this.producto.nombre?.trim()) {
      alert("Debe registrar el nombre del producto");
      return false;
    }
    if (!this.producto.categoria || !this.categorias.includes(this.producto.categoria)) {
      alert("Debe seleccionar una categoría válida");
      return false;
    }
    if (this.producto.stock < 0) {
      alert("El stock no puede ser negativo");
      return false;
    }
    if (!this.producto.proveedor?.trim()) {
      alert("Debe registrar el proveedor del producto");
      return false;
    }
    if (this.producto.costo <= 0) {
      alert("El costo debe ser mayor a 0");
      return false;
    }
    return true;
  }

  alertaStock(stock: number, alertaBaja: number): boolean {
    return stock <= alertaBaja;
  }
}