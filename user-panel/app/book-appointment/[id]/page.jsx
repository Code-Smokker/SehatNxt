import DoctorProfilePage from '@/components/pages/DoctorProfilePage';

// This is a Server Component that passes params to the Client Component
export default async function BookAppointmentIdPage({ params }) {
    const { id } = await params;
    return <DoctorProfilePage id={id} />;
}
