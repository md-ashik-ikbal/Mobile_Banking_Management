"use client"

import Routes from "@/app/routes/route";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link as UiLink } from "@nextui-org/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

type LoginData = {
    phone: string;
    password: string;
}

const LoginForm = () => {
    const { handleSubmit, register, formState: { errors }, watch, setError } = useForm<LoginData>();

    const loginData = watch();

    const [showPasswordField, setShowPasswordField] = useState(false);

    const Submit = async (data: LoginData) => {
        if (data.phone != "111") {
            setError('phone', {
                type: 'manual',
                message: "Phone is not recognize!"
            });
        } else {
            setShowPasswordField(true);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-[calc(100vh)]">
                <div className="w-[300px] text-center">
                    <form action="" onSubmit={handleSubmit(Submit)}>

                        <AnimatePresence>
                            <motion.span
                                key={"1"}
                                initial={{
                                    opacity: 0,
                                    position: "absolute",
                                }}
                                animate={{
                                    opacity: 1,
                                    position: "relative",
                                    transition: { duration: 1 }
                                }}
                                exit={{
                                    opacity: 0,
                                    position: "absolute",
                                    transition: { duration: 1 }
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #ff6ec7, #ffcd02)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text', // For Safari support
                                    color: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: '30px',
                                }}
                            >
                                {showPasswordField ? `${loginData.phone}` : "Log In With Phone"}
                            </motion.span>
                            {!showPasswordField && (
                                <motion.div
                                    key={"2"}
                                    className="w-[300px]"
                                    initial={{
                                        opacity: 0,
                                        position: "absolute",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        position: "relative",
                                        // y: 0,
                                        transition: { duration: 1 }
                                    }}
                                    exit={{
                                        opacity: 0,
                                        // y: 30,
                                        position: "absolute",
                                        transition: { duration: 1 }
                                    }}
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
                                    initial={{
                                        opacity: 0,
                                        position: "absolute",
                                        // y: 30
                                    }}
                                    animate={{
                                        opacity: 1,
                                        position: "relative",
                                        // y: 0,
                                        transition: { duration: 1 }
                                    }}
                                    exit={{
                                        opacity: 0,
                                        // y: -30,
                                        position: "absolute",
                                        transition: { duration: 1 }
                                    }}
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
                                initial={{
                                    opacity: 0,
                                    position: "absolute",
                                    // y: 30
                                }}
                                animate={{
                                    opacity: 1,
                                    position: "relative",
                                    // y: 0,
                                    transition: { duration: 1 }
                                }}
                                exit={{
                                    opacity: 0,
                                    // y: -30,
                                    position: "absolute",
                                    transition: { duration: 1 }
                                }}
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
}

export default LoginForm;