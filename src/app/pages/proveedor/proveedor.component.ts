import { Component } from '@angular/core';
import { Proveedor } from '../../models/proveedor.model';
import { ProveedorService } from '../../services/proveedor.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proveedor',
  imports: [FormsModule],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css'
})
export class ProveedorComponent {

  proveedores: any;
  proveedor = new Proveedor();

  constructor(private proveedorService: ProveedorService) {
    this.getProveedores();
  }

  async getProveedores(): Promise<void> {
    this.proveedores = await firstValueFrom(this.proveedorService.getProvedores());
  }

  // Método para validar el proveedor
  validarProveedor(): boolean {
    if (!this.proveedor.nombre || !this.proveedor.telefono || !this.proveedor.fechaCumpleanios || 
        !this.proveedor.calle || !this.proveedor.ciudad || !this.proveedor.codigoPostal) {
      alert('Por favor, completa todos los campos del proveedor.');
      return false;
    }
    if (!/^\d{10}$/.test(this.proveedor.telefono)) {
      alert('El número de teléfono debe contener 10 dígitos.');
      return false;
    }
    if (!/^\d{5}$/.test(this.proveedor.codigoPostal)) {
      alert('El código postal debe contener 5 dígitos.');
      return false;
    }
    return true;
  }

  async insertarProveedor() {
    if (!this.validarProveedor()) return;
    await this.proveedorService.agregarProveedor(this.proveedor);
    this.getProveedores();
    this.proveedor = new Proveedor();
  }

  selectProveedor(proveedorSeleccionado: Proveedor) {
    this.proveedor = proveedorSeleccionado;
  }

  async updateProveedor() {
    if (!this.validarProveedor()) return;
    await this.proveedorService.modificarProveedor(this.proveedor);
    this.getProveedores();
    this.proveedor = new Proveedor();
  }

  async deleteProveedor() {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este proveedor?');
    if (confirmacion) {
      await this.proveedorService.eliminarProveedor(this.proveedor);
      this.getProveedores();
      this.proveedor = new Proveedor();
    }
  }
}
