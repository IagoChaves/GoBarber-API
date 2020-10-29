import { Request, Response } from 'express';
// import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;
    // const parsedDate = parseISO(date); // Transformação de data

    const CreateAppointment = container.resolve(CreateAppointmentService);

    const appointment = await CreateAppointment.run({
      date,
      user_id,
      provider_id,
    });
    return response.json(appointment);
  }
}
