import { Injectable, inject } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private db: Firestore = inject(Firestore);

  constructor() { }

  // Obtener clientes
  getClientes() {
    const clientesCollection = collection(this.db, 'clientes');
    return collectionData(clientesCollection, { idField: 'id' }) as Observable<Cliente[]>;
  }

  // Agregar cliente
  agregarCliente(cliente: Cliente) {
    const clientesCollection = collection(this.db, 'clientes');
    const clienteData = {
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      fechaCumpleanios: cliente.fechaCumpleanios,
      correo: cliente.correo,
      calle: cliente.calle,
      ciudad: cliente.ciudad,
      codigoPostal: cliente.codigoPostal
    };
    return addDoc(clientesCollection, clienteData);
  }

  // Modificar cliente
  modificarCliente(cliente: Cliente) {
    const documentRef = doc(this.db, 'clientes', cliente.id);
    return updateDoc(documentRef, {
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      correo: cliente.correo,
      fechaCumpleanios: cliente.fechaCumpleanios,
      calle: cliente.calle,
      ciudad: cliente.ciudad,
      codigoPostal: cliente.codigoPostal
    });
  }

  // Eliminar cliente
  eliminarCliente(cliente: Cliente) {
    const documentRef = doc(this.db, 'clientes', cliente.id);
    return deleteDoc(documentRef);
  }
}