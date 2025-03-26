import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto',
  imports: [FormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  productos: Producto[] = [];
  producto: Producto = new Producto();
  categorias: string[] = ['Vidrios', 'Aluminios', 'Accesorios'];

  constructor(private productoService: ProductoService) {
    this.getProductos();
  }

  async getProductos(): Promise<void> {
    const productosData = await firstValueFrom(this.productoService.getProductos());
    this.productos = productosData.map((data: any) => ({
      id: data.id || '',
      nombre: data.nombre || '',
      categoria: data.categoria || '',
      stock: data.stock || 0,
      proveedor: data.proveedor || '',
      costo: data.costo || 0,
      alertaBaja: data.alertaBaja || 5
    }));
  }  

  async insertarProducto() {
    if (!this.validarProducto()) return;
    this.producto.alertaBaja = this.producto.alertaBaja ?? 5; // 👈 Se asigna 5 si es undefined
    await this.productoService.agregarProducto(this.producto);
    this.getProductos();
    this.producto = new Producto();
  }
  

  selectProducto(productoSeleccionado: Producto) {
    this.producto = { ...productoSeleccionado };
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
