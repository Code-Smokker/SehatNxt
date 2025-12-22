import DoctorProfilePage from '@/components/pages/DoctorProfilePage';

// This is a Server Component that passes params to the Client Component
export default function BookAppointmentIdPage({ params }) {
    return <DoctorProfilePage id={params.id} />;
}
