import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Row,
  Col,
  Label,
  FormFeedback,
  Input,
  Card,
  CardBody,
  Button,
  Form,
} from "reactstrap";
import { DownloadCloud } from "react-feather";
import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import CardLoader from "../Components/CardLoader";
import { upload } from "../../../Helper/index";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { error } from "jquery";
export default function FormEmployee({
  close,
  onSubmit,
  item,
  company,
  division,
  role,
  office,
  companyId
}) {
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  // console.log(company, "company")

  const ItemSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    title: yup.string().required("Title is required"),
    dob: yup.string().required("Date of birthday is required"),
    join_date: yup.string().required("Join date is required"),
    id_number: yup.string().required("ID number is required"),
    phone: yup.string().required("Phone number is required"),
    gender: yup.string().required("Gender is required"),
    status: yup.string().required("Status is required"),
    religion: yup.string().required("Religion is required"),
    division_id: yup.string().required("Division is required"),
    role_id: yup.string().required("Role is required"),
    marital_status: yup.string().required("Marital status is required"),
    dependents: yup.string().required("Dependents is required"),
    // password: yup.string().when([],{
    //   is:item ? true : false,
    //   then:yup.string().required("Password is required")
    // }),
  });


  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(ItemSchema) });
  console.log(errors, "error");

  useEffect(() => {
    if (item) {
      setValue("name", item.name);
      setValue("email", item.email);
      setValue("nip", item.nip);
      setValue("role_id", item.role_id);
      setValue("division", item.division);
      setValue("title", item.title);
      setValue("attachment", item.attachment)
      setValue("phone", item.phone);
      setValue("company_id", item.company_id)
      setValue("division_id", item.division_id)  
      if (item.employee_attribute) {
        setValue("dob", dayjs(item.employee_attribute.dob).format("YYYY-MM-DD"));
        setValue("join_date", dayjs(item.employee_attribute.join_date).format("YYYY-MM-DD"));
        setValue("id_number", item.employee_attribute.id_number);
        setValue("id_tax_number", item.employee_attribute.id_tax_number);
        setValue("gender", item.employee_attribute.gender);
        setValue("religion", item.employee_attribute.religion);
        setValue("status", item.employee_attribute.status);
        setValue("marital_status", item.employee_attribute.marital_status)
        setValue("dependents", item.employee_attribute.dependents)
        setValue("bank_Account", item.employee_attribute.bank_Account)  
        setValue("bank_Account_Name", item.employee_attribute.bank_Account_Name)  
        setValue("bank_Account_Number", item.employee_attribute.bank_Account_Number)  
      }
    }
    setValue("company_id", companyId)
  }, [item]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles, "acceptedFiles")
      try {
        const { size, name } = acceptedFiles[0];
        if (size > 3000000)
          return toast.error(`Error : File size should not exceed 3mb`, {
            position: "top-center",
          });
        setFile(acceptedFiles[0]);
        setIsLoading(true);
        const post = await upload(acceptedFiles[0], name, "attendance/user");
        setIsLoading(false);
        setAttachment(post);
      } catch (error) {
        setIsLoading(false);
        return toast.error(`Error : ${error.message}`, {
          position: "top-center",
        });
      }
    },
  });

  const onSubmitForm = (arg) => {
    arg.profile_picture = attachment;
    if (!item) {
      arg.password = arg.password ? arg.password : "121212";
    }
    return onSubmit(arg);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitForm)}>
      <Row>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="name">
            Name
          </Label>
          <Controller
            name="name"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                name="name"
                invalid={errors.name && true}
              />
            )}
          />
          {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="email">
            Email
          </Label>
          <Controller
            name="email"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                {...field}
                disabled={!!item}
                name="email"
                invalid={errors.email && true}
              />
            )}
          />
          {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="password">
            Password
          </Label>
          <Controller
            name="password"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                name="password"
                disabled={!!item}
                invalid={errors.password && true}
              />
            )}
          />
          {errors.password && (
            <FormFeedback>{errors.password.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="email">
            Join Date
          </Label>
          <Controller
            name="join_date"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="date"
                {...field}
                name="join_date"
                invalid={errors.join_date && true}
              />
            )}
          />
          {errors.join_date && (
            <FormFeedback>{errors.join_date.message}</FormFeedback>
          )}
        </Col>
        <Col md="12" sm="12" className="my-2 fs-5 fw-bold">
          Employee Attribute
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="dob">
            Date Of Birth
          </Label>
          <Controller
            name="dob"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="date"
                {...field}
                name="dob"
                invalid={errors.dob && true}
              />
            )}
          />
          {errors.dob && <FormFeedback>{errors.dob.message}</FormFeedback>}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="email">
            Gender
          </Label>
          <Controller
            name="gender"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                name="gender"
                value={item?.employee_attribute.gender}
                invalid={errors.gender && true}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Input>
            )}
          />
          {errors.gender && (
            <FormFeedback>{errors.gender.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="religion">
            Religion
          </Label>
          <Controller
            name="religion"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                name="religion"
                value={item?.employee_attribute.religion}
                invalid={errors.religion && true}
              >
                <option value="">Select religion</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Budha">Budha</option>
                <option value="Hindu">Hindu</option>
                <option value="Other">Other</option>
              </Input>
            )}
          />
          {errors.religion && (
            <FormFeedback>{errors.religion.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="phone">
            Phone Number
          </Label>
          <Controller
            name="phone"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                name="phone"
                invalid={errors.phone && true}
              />
            )}
          />
          {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="id_number">
            ID Number
          </Label>
          <Controller
            name="id_number"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                name="id_number"
                invalid={errors.id_number && true}
              />
            )}
          />
          {errors.id_number && (
            <FormFeedback>{errors.id_number.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="id_tax_number">
            ID Tax Number
          </Label>
          <Controller
            name="id_tax_number"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                name="id_tax_number"
                invalid={errors.id_tax_number && true}
              />
            )}
          />
          {errors.id_tax_number && (
            <FormFeedback>{errors.id_tax_number.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="marital_status">
            Marital Status
          </Label>
          <Controller
            name="marital_status"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                name="marital_status"
                // value={item?.employee_attribute.religion}
                invalid={errors.marital_status && true}
              >
                <option value="">Select status</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="Widow">Widow/widower</option>
              </Input>
            )}
          />
          {errors.marital_status && (
            <FormFeedback>{errors.marital_status.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="dependents">
            Dependents
          </Label>
          <Controller
            name="dependents"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                name="dependents"
                // value={item?.employee_attribute.religion}
                invalid={errors.religion && true}
              >
                <option value="">Select dependents</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value=">5">more than 4</option>
              </Input>
            )}
          />
          {errors.dependents && (
            <FormFeedback>{errors.dependents.message}</FormFeedback>
          )}
        </Col>
        <Col md="12" sm="12" className="my-2 fs-5 fw-bold">
          Position
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="company_id">
            Company
          </Label>
          <Controller
            name="company_id"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                name="company_id"
                disabled={companyId !== undefined }
                invalid={errors.company_id && true}
              >
                <option value="">Select company</option>
                {company.map((x) => (
                  <option key={x.name} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </Input>
            )}
          />
          {errors.company_id && (
            <FormFeedback>{errors.company_id.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="division_id">
            Division
          </Label>
          <Controller
            name="division_id"
            defaultValue=""
            control={control}
            // value={divisionSelect}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                name="division_id"
                invalid={errors.division_id && true}
              >
                <option value="">Select division</option>
                {division.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </Input>
            )}
          />
          {errors.division_id && (
            <FormFeedback>{errors.division_id.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="status">
            Status
          </Label>
          <Controller
            name="status"
            defaultValue=""
            control={control}
            value={item?.employee_attribute.status}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                name="status"
                invalid={errors.status && true}
              >
                <option value="">Select status</option>
                <option value="probation">Probation</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="fulltime">Fulltime</option>
                <option value="non_active">Non Active</option>
              </Input>
            )}
          />
          {errors.status && (
            <FormFeedback>{errors.status.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="role_id">
            Role
          </Label>
          <Controller
            name="role_id"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                name="role_id"
                invalid={errors.role_id && true}
              >
                <option value="">Select role</option>
                {role?.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </Input>
            )}
          />
          {errors.role_id && (
            <FormFeedback>{errors.role_id.message}</FormFeedback>
          )}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="title">
            Title
          </Label>
          <Controller
            name="title"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                name="title"
                placeholder="Ex:Finance Staff"
                invalid={errors.title && true}
              />
            )}
          />
          {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="nip">
            NIP
          </Label>
          <Controller
            name="nip"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                name="nip"
                invalid={errors.nip && true}
              />
            )}
          />
          {errors.nip && <FormFeedback>{errors.nip.message}</FormFeedback>}
        </Col>
        <Col md="12" sm="12" className="my-2 fs-5 fw-bold">
          Bank 
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="bank_Account">
            Bank Account
          </Label>
          <Controller
            name="bank_Account"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                name="bank_Account"
                invalid={errors.bank_Account && true}
              />
            )}
          />
          {errors.bank_Account && <FormFeedback>{errors.bank_Account.message}</FormFeedback>}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="bank_Account_Name">
            Bank Account Name
          </Label>
          <Controller
            name="bank_Account_Name"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
              type="text"
              {...field}
              name="bank_Account_Name"
              invalid={errors.bank_Account_Name && true}
              placeholder="Ex: Jhon Doe"
              />
            )}
          />
          {errors.bank_Account_Name && <FormFeedback>{errors.bank_Account_Name.message}</FormFeedback>}
        </Col>
        <Col md="6" sm="12" className="mb-1">
          <Label className="form-label" for="bank_Account_Number">
            Bank Account Number
          </Label>
          <Controller
            name="bank_Account_Number"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                name="bank_Account_Number"
                invalid={errors.bank_Account_Number && true}
              />
            )}
          />
          {errors.bank_Account_Number && <FormFeedback>{errors.bank_Account_Number.message}</FormFeedback>
          }
        </Col>
        <Col md="12" sm="12" className="mb-1">
          <Label className="form-label">Profile Picture</Label>
          <Card className="bg-transparent border-primary shadow-none">
            <CardBody>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <div className="d-flex align-items-center justify-content-center flex-column">
                  {!attachment ? (
                    <DownloadCloud size={64} />
                  ) : (
                    <>
                      <p className="text-primary">{file ? file.name : "-"}</p>
                    </>
                  )}

                  <h5>Drop Files here or click to upload</h5>
                  <p className="text-secondary">
                    Drop files here or click{" "}
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      browse
                    </a>{" "}
                    horough your machine
                  </p>
                </div>
              </div>
              <CardLoader open={isLoading} />
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Button type="button" size="md" color="danger" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" size="md" color="primary" className="m-1">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

FormEmployee.defaultProps = {
  item: null,
};
