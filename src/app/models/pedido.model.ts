export class Pedido {
    id!: string;
    clienteId!: string;
    clienteNombre!: string;
    clienteTelefono!:string;
    fechaPedido!: string;
    productos!: { productoId: string; nombre: string; cantidad: number; costo: number }[]; 
    totalCosto!: number;
    pagado!: boolean;
    estado!: string;

}  