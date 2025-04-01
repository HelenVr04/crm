import {  OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { ProductoComponent } from '../producto/producto.component';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productosStockBajo: Producto[] = [];


  constructor(private productoService: ProductoService) {}
  ngOnInit(): void {
    this.obtenerProductosStockBajo();
  }
  async obtenerProductosStockBajo(): Promise<void> {
    try {
      const productosData = await this.productoService.getProductos().toPromise();
      if (productosData) {
        this.productosStockBajo = productosData
          .map((producto: any) => ({
            id: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            stock: producto.stock,
            proveedor: producto.proveedor,
            costo: producto.costo,
            alertaBaja: producto.alertaBaja
          }))
          .filter((producto: Producto) => producto.stock <= producto.alertaBaja);
      }
    } catch (error) {
      console.error("Error al obtener productos con stock bajo:", error);
      this.productosStockBajo = [];
    }
  }
}
