export class Producto {
    id!: string;
    nombre!: string;
    categoria!: string; 
    stock!: number;
    proveedor!: string;
    costo!: number;
    alertaBaja: number = 5; // Nivel de stock para activar la alerta
  }
  