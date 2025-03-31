import { Injectable, inject } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable  } from 'rxjs';
import { Proveedor } from '../models/proveedor.model';
@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private db: Firestore= inject(Firestore);
  constructor() { }

  getProvedores(){
    const proveedoresCollection = collection(this.db, 'proveedores');
    return collectionData(proveedoresCollection, { idField: 'id' }) as Observable<Proveedor[]>;
  }

    // Agregar cliente
    agregarProveedor(proveedor: Proveedor) {
      const proveedoresCollection = collection(this.db, 'proveedores');
      const proveedorData = {
        nombre: proveedor.nombre,
        telefono: proveedor.telefono,
        fechaCumpleanios: proveedor.fechaCumpleanios,
        calle: proveedor.calle,
        ciudad: proveedor.ciudad,
        codigoPostal: proveedor.codigoPostal,
      };
      return addDoc(proveedoresCollection, proveedorData);
    }

    //modificar proveedor

    modificarProveedor(proveedor: Proveedor) {
      const documentRef = doc(this.db, 'proveedores', proveedor.id);
      return updateDoc(documentRef, {
        nombre: proveedor.nombre,
        telefono: proveedor.telefono,
        fechaCumpleanios: proveedor.fechaCumpleanios,
        calle: proveedor.calle,
        ciudad: proveedor.ciudad,
        codigoPostal: proveedor.codigoPostal,
      });
    }
      //eliminar proveedor 

      eliminarProveedor(proveedor: Proveedor) {
      const documentRef = doc(this.db, 'proveedores', proveedor.id);
      return deleteDoc(documentRef);
    }
}
