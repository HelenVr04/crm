import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ProductoComponent } from './pages/producto/producto.component';
<<<<<<< HEAD
import { PedidoComponent } from './pages/pedido/pedido.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
=======
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth.guard';

>>>>>>> 88b60777c5a608024759915458cd402c9dc99f9c

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