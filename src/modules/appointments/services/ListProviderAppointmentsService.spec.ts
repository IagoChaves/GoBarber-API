import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointment: ListProvidersAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvidersAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointment = new ListProvidersAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list the appointments on a specific day ', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '1231231',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });
    const appointments = await listProviderAppointment.execute({
      provider_id: 'user',
      year: 2020,
      day: 20,
      month: 5,
    });
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
