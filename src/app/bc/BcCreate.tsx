/* eslint-disable */
'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { useRouter } from 'next/navigation';

interface BcCreateFundType {
    bc_name: string;
    total_lot_amount: number;
    interest_rate: number;
    second_person_discount: number;
    third_person_discount: number;
}

interface FormFieldProps {
    label: string;
    id: string;
    placeholder: string;
    type?: string;
    register: ReturnType<typeof useForm<BcCreateFundType>>['register'];
    validationRules?: Record<string, any>;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, placeholder, type = "text", register, validationRules }) => (
    <div className="flex flex-col mb-3">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} type={type} placeholder={placeholder} {...register(id, validationRules)} />
    </div>
);

const BcCreate = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<BcCreateFundType>({
        mode: 'onSubmit',
        reValidateMode: 'onBlur'
    });

    const router = useRouter()

    const onSubmit = async (data: BcCreateFundType) => {
        console.log(data);
        try {
            const response = await axios.post('/api/bc', data)
            console.log(123, { response })
            router.push(`/bc/${response.data.chit_id}`)
        } catch (error) {

        }

        // Handle form submission
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 shadow-lg rounded-lg">
            {/* <h2 className="text-xl font-bold mb-4">Create BC Fund</h2> */}

            <FormField
                label="BC Fund Name"
                id="bc_name"
                placeholder="Enter Fund Name"
                register={register}
                validationRules={{ required: 'Fund name is required' }}
            />
            {errors.bc_name && <p className="text-red-600">{errors.bc_name.message}</p>}

            <div className="flex justify-between">
                <FormField
                    label="Total Lot Amount (INR)"
                    id="total_lot_amount"
                    placeholder="Enter Total Lot Amount"
                    type="number"
                    register={register}
                    validationRules={{
                        required: 'Total lot amount is required',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Must be a positive number' }
                    }}
                />
                <FormField
                    label="Interest Rate (%)"
                    id="interest_rate"
                    placeholder="Enter Interest Rate"
                    type="number"
                    register={register}
                    validationRules={{
                        required: 'Interest rate is required',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Must be a positive rate' }
                    }}
                />
            </div>

            <div className="flex justify-between">
                <FormField
                    label="2nd Discount (INR)"
                    id="second_person_discount"
                    placeholder="Enter 2nd Person Discount"
                    type="number"
                    register={register}
                    validationRules={{
                        valueAsNumber: true,
                        min: { value: 0, message: 'Must be a positive number' }
                    }}
                />
                <FormField
                    label="3rd Discount (INR)"
                    id="third_person_discount"
                    placeholder="Enter 3rd Person Discount"
                    type="number"
                    register={register}
                    validationRules={{
                        valueAsNumber: true,
                        min: { value: 0, message: 'Must be a positive number' }
                    }}
                />
            </div>

            <Button type="submit" className="mt-4 w-full">Create Fund</Button>
        </form>
    );
}

export default BcCreate;
