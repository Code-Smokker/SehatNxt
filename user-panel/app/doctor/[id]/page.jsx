import DoctorProfilePage from '@/components/pages/DoctorProfilePage';

export default async function DoctorProfile({ params }) {
    const { id } = await params;
    return <DoctorProfilePage id={id} />;
}
