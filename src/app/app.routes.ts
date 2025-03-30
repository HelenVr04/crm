import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

export const routes: Routes = [
    {
        path:'home',
        component: HomeComponent
    },
    {
        path:'clientes',
        component: ClienteComponent
    },
    {
        path:'inventario',
        component: ProductoComponent
    },
    {
        path: 'pedidos',
        component: PedidoComponent
    },
    {
        path:'proveedores',
        component: ProveedorComponent
    },
    {
        path:'about',
        component: AboutComponent
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];