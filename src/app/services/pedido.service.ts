import { Injectable, inject } from '@angular/core';
  import { Pedido } from '../models/pedido.model';
  import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
  import { first, Observable } from 'rxjs';
  import { query, where, getDocs } from '@angular/fire/firestore';


  @Injectable({
    providedIn: 'root'
  })
  export class PedidoService {
    private db: Firestore = inject(Firestore); 

    constructor() { }

    // Obtener pedidos
    getPedidos() {
      const pedidosCollection = collection(this.db, 'pedidos');
      return collectionData(pedidosCollection, { idField: 'id' }).pipe(first());
    }

    // Agregar pedido
    agregarPedido(pedido: Pedido) {
      const pedidosCollection = collection(this.db, 'pedidos');
      const pedidoData = {
        clienteId: pedido.clienteId,
        clienteNombre: pedido.clienteNombre,
        clienteTelefono: pedido.clienteTelefono,
        fechaPedido: pedido.fechaPedido,
        productos: pedido.productos,  
        totalCosto: pedido.totalCosto
      };
      return addDoc(pedidosCollection, pedidoData);
    }

    // Modificar pedido
    modificarPedido(pedido: Pedido) {
      const documentRef = doc(this.db, 'pedidos', pedido.id);
      return updateDoc(documentRef, {
        clienteId: pedido.clienteId,
        clienteNombre: pedido.clienteNombre,
        clienteTelefono: pedido.clienteTelefono,
        fechaPedido: pedido.fechaPedido,
        productos: pedido.productos,
        totalCosto: pedido.totalCosto,
        estado: pedido.estado, // Solo actualiza el estado
        pagado: pedido.pagado  // Solo actualiza el campo "pagado"
      });
    }

    // Eliminar pedido
    eliminarPedido(pedido: Pedido) {
      const documentRef = doc(this.db, 'pedidos', pedido.id);
      return deleteDoc(documentRef);
    }

  // Obtener pedidos por cliente
  getPedidosPorCliente(clienteId: string): Observable<Pedido[]> {
    const pedidosCollection = collection(this.db, 'pedidos');
    const pedidosQuery = query(pedidosCollection, where('clienteId', '==', clienteId));
    return collectionData(pedidosQuery, { idField: 'id' }) as Observable<Pedido[]>;
  }

  }