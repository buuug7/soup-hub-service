import { Injectable } from '@nestjs/common';
import { Cat } from './cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [{ name: 't1', age: 12, breed: 'f1' }];

  create(cat: Cat) {
    this.cats.push(cat);
    return this.cats;
  }

  findAll(): Promise<Cat[]> {
    return new Promise(resolve => {
      console.log('cats=', this.cats);
      resolve(this.cats);
    });
  }
}
