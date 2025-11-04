import { ApolloClient } from '@apollo/client';
import { AppointmentApiGroup, AuthApiGroup, CarePlanApiGroup, PatientApiGroup } from './api-group.svc';

type ApiConstructor<T> = new (client: ApolloClient) => T;

export type TApiMethod<T> = T extends { execute: (...args: unknown[]) => Promise<infer R> } ? R : never;

// === MAIN CLASS ===
export class ApiServices {
  private cache = new Map<string, unknown>();

  // Lazy-loaded group instances
  private _carePlan?: CarePlanApiGroup;
  private _auth?: AuthApiGroup;
  private _patient?: PatientApiGroup;
  private _appointment?: AppointmentApiGroup;

  constructor(private client: ApolloClient) {}

  /**
   * Generic synchronous lazy loader
   */
  private lazyLoad<T>(key: string, ctor: ApiConstructor<T>): T {
    if (!this.cache.has(key)) {
      console.log(`🔄 Lazy loading API: ${key}`);
      this.cache.set(key, new ctor(this.client));
    }
    return this.cache.get(key) as T;
  }

  // === API GROUPS WITH LAZY GETTERS ===
  public get carePlan(): CarePlanApiGroup {
    if (!this._carePlan) {
      this._carePlan = new CarePlanApiGroup(this);
    }
    return this._carePlan;
  }

  public get auth(): AuthApiGroup {
    if (!this._auth) {
      this._auth = new AuthApiGroup(this);
    }
    return this._auth;
  }

  public get patient(): PatientApiGroup {
    if (!this._patient) {
      this._patient = new PatientApiGroup(this);
    }
    return this._patient;
  }

  public get appointment(): AppointmentApiGroup {
    if (!this._appointment) {
      this._appointment = new AppointmentApiGroup(this);
    }
    return this._appointment;
  }

  /**
   * Internal method for API groups to access lazy loader
   */
  public _lazyLoad = this.lazyLoad.bind(this);

  /**
   * Clear API cache
   */
  public clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
      this._carePlan = undefined;
      this._auth = undefined;
      this._patient = undefined;
      this._appointment = undefined;
    }
  }

  /**
   * Get cache statistics
   */
  public getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Factory method
   */
  public static create(client: ApolloClient): ApiServices {
    return new ApiServices(client);
  }
}
