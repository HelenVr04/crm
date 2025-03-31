import { Injectable } from '@angular/core';
import { setPersistence } from 'firebase/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { Auth, user, User, browserSessionPersistence, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  constructor(private firebaseAuth: Auth) { 
    this.user$ = user(this.firebaseAuth).pipe(
      tap(user => this.authState.next(user))
    );
    
    this.isAuthenticated$ = this.user$.pipe(
      map(user => !!user)
    );
    
    this.setSessionStoragePersistence();
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth, email, password
    ).then(() => {
      console.log('Usuario autenticado correctamente');
    });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
      this.authState.next(null);
    });
    return from(promise);
  }

  // Método síncrono para verificar autenticación
  get currentUser(): User | null {
    return this.authState.value;
  }
}