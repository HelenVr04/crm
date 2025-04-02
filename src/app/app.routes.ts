import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ProductoComponent } from './pages/producto/producto.component';

import { PedidoComponent } from './pages/pedido/pedido.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path:'',
        component: LoginComponent
    },
    {
        path:'Home',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path:'clientes',
        component: ClienteComponent,
        canActivate: [authGuard]
    },
    {
        path:'inventario',
        component: ProductoComponent,
        canActivate: [authGuard]

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
        component: AboutComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
