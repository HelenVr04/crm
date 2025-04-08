import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { PedidoService } from '../../services/pedido.service';
import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';

Chart.register(...registerables);

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {
  productosVendidosChart: any;
  clientesFrecuentesChart: any;

  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private productoService: ProductoService
  ) {}

  async ngOnInit() {
    await this.cargarDatosGraficas();
  }

  async cargarDatosGraficas() {
    try {
      // Obtener todos los pedidos
      const pedidos = await firstValueFrom(this.pedidoService.getPedidos());
      
      // Procesar datos para productos más vendidos
      const productosData = this.procesarProductosVendidos(pedidos);
      this.crearGraficaProductos(productosData);
      
      // Procesar datos para clientes frecuentes
      const clientesData = this.procesarClientesFrecuentes(pedidos);
      this.crearGraficaClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar datos para gráficas:', error);
    }
  }

  procesarProductosVendidos(pedidos: any[]): { nombres: string[], cantidades: number[] } {
    const productosMap = new Map<string, number>();

    pedidos.forEach(pedido => {
      if (pedido.productos && Array.isArray(pedido.productos)) {
        pedido.productos.forEach((producto: any) => {
          const nombre = producto.nombre;
          const cantidad = producto.cantidad || 0;
          
          if (productosMap.has(nombre)) {
            productosMap.set(nombre, productosMap.get(nombre)! + cantidad);
          } else {
            productosMap.set(nombre, cantidad);
          }
        });
      }
    });

    // Ordenar por cantidad descendente y tomar los 10 primeros
    const sorted = Array.from(productosMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      nombres: sorted.map(item => item[0]),
      cantidades: sorted.map(item => item[1])
    };
  }

  procesarClientesFrecuentes(pedidos: any[]): { nombres: string[], pedidosCount: number[] } {
    const clientesMap = new Map<string, number>();

    pedidos.forEach(pedido => {
      if (pedido.clienteNombre) {
        const nombre = pedido.clienteNombre;
        
        if (clientesMap.has(nombre)) {
          clientesMap.set(nombre, clientesMap.get(nombre)! + 1);
        } else {
          clientesMap.set(nombre, 1);
        }
      }
    });

    // Ordenar por cantidad de pedidos descendente y tomar los 10 primeros
    const sorted = Array.from(clientesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      nombres: sorted.map(item => item[0]),
      pedidosCount: sorted.map(item => item[1])
    };
  }

  crearGraficaProductos(data: { nombres: string[], cantidades: number[] }) {
    const ctx = document.getElementById('productosChart') as HTMLCanvasElement;
    
    // Destruir gráfica anterior si existe
    if (this.productosVendidosChart) {
      this.productosVendidosChart.destroy();
    }

    this.productosVendidosChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.nombres,
        datasets: [{
          label: 'Cantidad Vendida',
          data: data.cantidades,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Top 10 Productos Más Vendidos'
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad Vendida'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Productos'
            }
          }
        }
      }
    });
  }

  crearGraficaClientes(data: { nombres: string[], pedidosCount: number[] }) {
    const ctx = document.getElementById('clientesChart') as HTMLCanvasElement;
    
    // Destruir gráfica anterior si existe
    if (this.clientesFrecuentesChart) {
      this.clientesFrecuentesChart.destroy();
    }

    this.clientesFrecuentesChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.nombres,
        datasets: [{
          label: 'Pedidos Realizados',
          data: data.pedidosCount,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(199, 199, 199, 0.5)',
            'rgba(83, 102, 255, 0.5)',
            'rgba(40, 159, 64, 0.5)',
            'rgba(210, 99, 132, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(40, 159, 64, 1)',
            'rgba(210, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Top 10 Clientes Más Frecuentes'
          },
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw} pedidos`;
              }
            }
          }
        }
      }
    });
  }
}