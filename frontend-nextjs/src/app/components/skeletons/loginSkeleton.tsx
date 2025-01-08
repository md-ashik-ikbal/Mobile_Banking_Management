import { Skeleton } from "@nextui-org/react";

const LoginSkeleton = () => {
    return (
        <>
            <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
                <Skeleton className="rounded-lg">
                    <div className="w-[300px] h-12 text-center" />
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[300px] h-11 text-center" />
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="w-[300px] h-10 text-center" />
                </Skeleton>
                <Skeleton className="rounded-lg mt-2">
                    <div className="w-[150px] h-6 text-center" />
                </Skeleton>
            </div>
        </>
    );
}

export default LoginSkeleton;