export class Pedido {
    id!: string;
    clienteId!: string;
    clienteNombre!: string;
    fechaPedido!: string;
    productos!: { productoId: string; nombre: string; cantidad: number; costo: number }[]; 
    totalCosto!: number;
}  