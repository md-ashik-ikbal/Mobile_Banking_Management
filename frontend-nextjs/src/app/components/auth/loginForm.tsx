"use client"

import useAuth from "@/app/hooks/auth/useAuth";
import useProfile from "@/app/hooks/user/useProfile";
import API_ENDPOINTS from "@/app/routes/api";
import Routes from "@/app/routes/route";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link as UiLink, user } from "@nextui-org/react";
import axios from "axios";
import { AnimatePresence, motion, Variants } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useLocalUsers from "@/app/hooks/auth/useLocalUsers";

type LoginData = {
    phone: string;
    password: string;
}

const LoginForm = () => {
    const [users, setUsers] = useState<any>(null);
    const { handleSubmit, register, formState: { errors }, watch, setError } = useForm<LoginData>();
    const loginData = watch();
    const [showPasswordField, setShowPasswordField] = useState(false);
    const { retrieve_data, save_data } = useLocalUsers();
    const Router = useRouter();

    useEffect(() => {
        const get_user = async () => {
            return setUsers(await retrieve_data());
        }

        get_user();
    }, []);

    const check_phone = async (phone: string) => {
        try {
            const phone_vlidation = await axios.post(API_ENDPOINTS.Validate_Phone, { phone: phone });

            if (phone_vlidation.status === 201) {
                setShowPasswordField(true);

                return true;
            } else {
                setError('phone', {
                    type: 'manual',
                    message: "Phone is not recognized!"
                });

                return false;
            }

        } catch (error: any) {
            if (error.response) {
                setError('phone', {
                    type: 'manual',
                    message: error.response.data.message
                });
            } else {
                setError('phone', {
                    type: 'manual',
                    message: 'Network error. Please try again later.'
                });
            }

            return false;
        }
    }

    const Submit = async (data: LoginData) => {
        try {
            if (await check_phone(data.phone) && data.password != null) {
                const token = await useAuth(data.phone, data.password);

                if (!token) {
                    setError('password', {
                        type: 'manual',
                        message: "Password did not match!"
                    });
                } else {
                    save_data(data.phone);
                    Router.push(Routes.Dashboard);
                }
            }
        } catch (error: any) {
            if (error.response) {
                setError('password', {
                    type: 'manual',
                    message: error.response.data.message
                });
            } else {
                setError('password', {
                    type: 'manual',
                    message: 'Network error. Please try again later.'
                });
            }
            console.log(error)

            return false;
        }
    }

    const variants: Variants = {
        initial: {
            opacity: 0,
            position: "absolute",
        },
        animate: {
            opacity: 1,
            position: "relative",
            transition: {
                duration: 1,
            }
        },
        exit: {
            opacity: 0,
            position: "absolute",
            transition: {
                duration: 1,
            }
        }
    }

    if (!users) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[calc(100vh)]">
                    <div className="min-w-[300px] text-center">
                        <form action="" onSubmit={handleSubmit(Submit)}>
                            <AnimatePresence>
                                <motion.span
                                    key={"1"}
                                    className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent font-bold text-2xl"
                                    initial={"initial"}
                                    animate={"animate"}
                                    exit={"exit"}
                                    variants={variants}
                                >
                                    {showPasswordField ? `${loginData.phone}` : "Log In With Phone"}
                                </motion.span>
                                {!showPasswordField && (
                                    <motion.div
                                        key={"2"}
                                        className="w-[300px]"
                                        initial={"initial"}
                                        animate={"animate"}
                                        exit={"exit"}
                                        variants={variants}
                                    >
                                        <Input
                                            isClearable
                                            isInvalid={!!errors.phone}
                                            errorMessage={errors.phone?.message}
                                            label="Phone"
                                            type="text"
                                            size="sm"
                                            variant="bordered"
                                            className="mt-2"
                                            {...register('phone', {
                                                required: "Phone couldn't be empty!",
                                                // pattern: { value: /\S+@\S+\.\S+/, message: 'Email is required in valid formate' }
                                            })}
                                        />
                                    </motion.div>
                                )
                                }
                                {showPasswordField && (
                                    <motion.div
                                        key={"3"}
                                        className="w-[300px]"
                                        initial={"initial"}
                                        animate={"animate"}
                                        exit={"exit"}
                                        variants={variants}
                                    >
                                        <Input
                                            isClearable
                                            isInvalid={!!errors.password}
                                            errorMessage={errors.password?.message}
                                            label="Password"
                                            type="password"
                                            size="sm"
                                            variant="bordered"
                                            className="mt-2"
                                            {...register('password', {
                                                required: "Password is required!",
                                            })}
                                        />
                                    </motion.div>
                                )
                                }
                                <motion.div
                                    key={"4"}
                                    className="w-[300px]"
                                    initial={"initial"}
                                    animate={"animate"}
                                    exit={"exit"}
                                    variants={variants}
                                >
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="bordered"
                                        radius="sm"
                                        className="w-full my-2"
                                    >
                                        {showPasswordField ? "Log In" : "Continue"}
                                    </Button>
                                </motion.div>
                                {(!showPasswordField) ? (
                                    <UiLink isBlock color="secondary" href="#" as={Link} className="mt-2">
                                        Other Sing In Option
                                    </UiLink>
                                ) : (
                                    <Button
                                        variant="light"
                                        color="warning"
                                        radius="sm"
                                        className=""
                                        onPress={() => { setShowPasswordField(false) }}
                                    >
                                        {"Back"}
                                    </Button>
                                )
                                }
                            </AnimatePresence>
                        </form>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                {
                    users.map((user: number) => (
                        <div key={user}>
                            <h1>Welcome: { user } </h1>
                        </div>
                    ))
                }
            </>
        );
    }
}

export default LoginForm;