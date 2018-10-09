import RequestModel from '../models/request';


  export async function idempotency (args: any, handler: Function) {
    const request = await RequestModel.findOne({ where: { id: args.request } }) as any;
    if (request && request.result) {
      return request.result;
    }

    if (request && request.error) {
      throw new Error(request.error.message);
    }

    let result;
    let error;
    try {
      result = await handler(null, args);
    } catch (err) {
      error = err;
      result = err;
    }
    await RequestModel.create({
      id: args.request,
      result,
      error,
    });
    return result;
  };
