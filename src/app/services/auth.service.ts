import { Injectable } from '@angular/core';
import { Auth, user,User,browserSessionPersistence,signInWithEmailAndPassword,signOut,createUserWithEmailAndPassword,UserCredential,setPersistence} from '@angular/fire/auth';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  constructor(private firebaseAuth: Auth) { 
    // Initialize auth state
    this.user$ = user(this.firebaseAuth).pipe(
      tap(user => {
        this.authState.next(user);
        console.log('User state changed:', user);
      })
    );
    
    this.isAuthenticated$ = this.user$.pipe(
      map(user => !!user)
    );
    
    this.setPersistence()
  }

  private setPersistence(): Promise<void> {
    return setPersistence(this.firebaseAuth, browserSessionPersistence)
      .then(() => console.log('Persistence set to session'))
      .catch(error => console.error('Error setting persistence:', error));
  }

  // Login with email and password
  login(email: string, password: string): Observable<void> {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, email, password)
        .then(() => {
          console.log('User logged in successfully');
        })
    );
  }

  // Register new user
  register(email: string, password: string): Observable<UserCredential> {
    return from(this.setPersistence().then(() => {
      return createUserWithEmailAndPassword(this.firebaseAuth, email, password)
        .then((userCredential) => {
          console.log('User registered and authenticated:', userCredential.user);
          return userCredential;
        });
    }));
  }

  // Logout current user
  logout(): Observable<void> {
    return from(
      signOut(this.firebaseAuth)
        .then(() => {
          sessionStorage.clear();
          this.authState.next(null);
          console.log('User logged out successfully');
        })
    );
  }

  // Get current user synchronously
  get currentUser(): User | null {
    return this.authState.value;
  }

  // Get current user ID
  get currentUserId(): string | null {
    return this.currentUser?.uid || null;
  }

  // Get current user email
  get currentUserEmail(): string | null {
    return this.currentUser?.email || null;
  }

  // Check if user is authenticated
  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}