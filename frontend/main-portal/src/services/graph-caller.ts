import type { ApolloClient, DocumentNode, OperationVariables, ApolloQueryResult, FetchResult } from "@apollo/client";
import { TApiResult, TOperation } from "./type";

// IObserver interface for observer pattern
interface IObserver<T> {
  update(state: T): void;
}

// ISubject manage observers
interface ISubject<T> {
  attach(observer: IObserver<T>): void;
  detach(observer: IObserver<T>): void;
  notify(): void;
}

export abstract class GraphqlCaller<
  TData,       // Parsed data type
  TVariables extends NoInfer<OperationVariables | undefined> | undefined,  // Input variables cho query/mutation
  TRawResponse // Raw response from GraphQL
> implements ISubject<TApiResult<TData>> {
  protected observers: IObserver<TApiResult<TData>>[] = [];
  protected result: TApiResult<TData> = { status: "idle" };

  constructor(
    protected client: ApolloClient,
    protected query: DocumentNode,
    protected dataParser: (raw: TRawResponse) => TData,
    protected operation: TOperation = "query",
  ) {}

  attach(observer: IObserver<TApiResult<TData>>): void {
    this.observers.push(observer);
  }

  detach(observer: IObserver<TApiResult<TData>>): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  detachAll(): void {
    this.observers = [];
  }

  notify(): void {
    for (const obs of this.observers) {
      obs.update(this.result);
    }
  }

  public getResult(): TApiResult<TData> {
    return this.result;
  }

  subscribe(callback: () => void): () => void {
    const observer: IObserver<TApiResult<TData>> = {
      update: () => callback(),
    };
    this.attach(observer);
    return () => this.detach(observer);
  }

  protected setResult(result: TApiResult<TData>) {
    this.result = result;
    this.notify();
  }

  public async execute(variables: TVariables) {
    this.setResult({ status: "loading" });

    try {
      let resp: ApolloQueryResult<TRawResponse> | FetchResult<TRawResponse>;
      
      if (this.operation === "query") {
        resp = await this.client.query<TRawResponse>({ query: this.query, variables, errorPolicy: 'all' });
      } else {
        resp = await this.client.mutate<TRawResponse>({ mutation: this.query, variables, errorPolicy: 'all' });
      }

      
      if (resp.errors && resp.errors.length) {
        throw resp.errors;
      }

      if (resp.data == null) {
        this.setResult(
          { 
            status: "error", 
            message: "No data returned from GraphQL response" 
          });

        throw new Error("No data returned from GraphQL response");
      }

      const parsed = this.dataParser(resp.data);

      this.setResult({ status: "success", data: parsed });

      console.log("Raw GraphQL response (from GraphqlCaller):", resp.data);
      console.log("Parsed data (from GraphqlCaller): ", parsed);

      return parsed;
    } catch (error) {
      this.result = { status: "error" };
      this.notify();
      throw error;
    }
  }
}
