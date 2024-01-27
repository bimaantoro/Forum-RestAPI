const AddUserCase = require('../../../../Applications/use_case/AddUserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;
  }

  async postUserHandler(request, h) {
    const addUserCase = this._container.getInstance(AddUserCase.name);
    const addedUser = await addUserCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
