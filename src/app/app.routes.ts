import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ProductoComponent } from './pages/producto/producto.component';

import { PedidoComponent } from './pages/pedido/pedido.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth.guard';
import { RegistroComponent } from './pages/registro/registro.component';

export const routes: Routes = [
    {
        path:'',
        component: LoginComponent
    },
    {
        path: 'registro',
        component: RegistroComponent
    },
    {
        path:'home',
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
        component: PedidoComponent,
        canActivate: [authGuard]
    },
    {
        path:'proveedores',
        component: ProveedorComponent,
        canActivate: [authGuard]
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
