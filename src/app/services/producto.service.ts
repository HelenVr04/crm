import { Injectable, inject } from '@angular/core';
import { Producto } from '../models/producto.model';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc, increment } from '@angular/fire/firestore'; // Se importa increment
import { first } from 'rxjs';
import { getFirestore } from 'firebase/firestore'; // No es necesario importar FieldValue, solo getFirestore

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private db: Firestore = inject(Firestore);
  constructor() { }

  // Obtener productos
  getProductos() {
    const productosCollection = collection(this.db, 'productos');
    return collectionData(productosCollection, { idField: 'id' }).pipe(first());
  }

  // Agregar producto
  agregarProducto(producto: Producto) {
    const productosCollection = collection(this.db, 'productos');
    const productoData = {
      nombre: producto.nombre,
      categoria: producto.categoria,
      stock: producto.stock,
      proveedor: producto.proveedor,
      costo: producto.costo,
      alertaBaja: producto.alertaBaja ?? 10 
    };
    return addDoc(productosCollection, productoData);
  }

  // Modificar producto
  modificarProducto(producto: Producto) {
    const documentRef = doc(this.db, 'productos', producto.id);
    return updateDoc(documentRef, {
      nombre: producto.nombre,
      categoria: producto.categoria,
      stock: producto.stock,
      proveedor: producto.proveedor,
      costo: producto.costo,
      alertaBaja: producto.alertaBaja
    });
  }

  // Eliminar producto
  eliminarProducto(producto: Producto) {
    const documentRef = doc(this.db, 'productos', producto.id);
    return deleteDoc(documentRef);
  }

  // Actualizar el stock del producto
  actualizarStock(productoId: string, cantidad: number) {
    const db = getFirestore(); // Obtén la instancia de Firestore
    const documentRef = doc(db, 'productos', productoId);
    return updateDoc(documentRef, {
      stock: increment(-cantidad) // Restamos la cantidad usando increment
    });
  }
}
