import { router } from '@trpc/server';
import { useRouter } from 'next/router';
import FormPage from '~/components/form'

const MemberIDPage = () => {
    const router=useRouter()
    const{id}=router.query
    return (
        <FormPage formID={id as string}/>
    );
}

export default MemberIDPage;
