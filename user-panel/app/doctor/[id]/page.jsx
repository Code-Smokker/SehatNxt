import DoctorProfilePage from '@/components/pages/DoctorProfilePage';

export default function DoctorProfile({ params }) {
    return <DoctorProfilePage id={params.id} />;
}
