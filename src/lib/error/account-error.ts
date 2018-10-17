
import AppError from 'onewallet.library.error';

export default class SAGamingError extends AppError {
  constructor(id: string, message: string) {
    super('ACCOUNT_ERROR', message, { id, message });
  }
}