import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { PrimaryInputProps } from "@/types/type";
import { Controller, FieldValues } from "react-hook-form";

const options = [
   { label: "Frontend", value: "Frontend" },
   { label: "MERN", value: "MERN" },
];

const ProjectSelect = <T extends FieldValues>({ control, name, label }: PrimaryInputProps<T>) => {
   return (
      <Controller
         control={control}
         name={name}
         render={({ field, fieldState }) => {
            return (
               <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor={name}>{label}</FieldLabel>
                  <FieldContent>
                     <Select
                        id={name}
                        items={options}
                        value={field.value}
                        onValueChange={field.onChange}
                     >
                        <SelectTrigger
                           className="w-full"
                           aria-invalid={!!fieldState.error}
                        >
                           <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent
                           sideOffset={10}
                           align="end"
                        >
                           <SelectGroup>
                              {options.map((item) => (
                                 <SelectItem
                                    key={item.value}
                                    value={item.value}
                                 >
                                    {item.label}
                                 </SelectItem>
                              ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </FieldContent>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
               </Field>
            );
         }}
      />
   );
};

export default ProjectSelect;
