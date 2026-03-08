import React from "react";
import Input from "./Input.jsx";
import Button from "./Button.jsx";

const Form = ({ id, top, bottom, className, inputs, buttons, onSubmitFunction }) => {

    const [formData, setFormData] = React.useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitFunction(formData);
    }


    return (
        <form
            key={id}
            onSubmit={handleSubmit}
            className={`form-container ${className || ''}`}
        >
            <div className="input-container">

                {top}

                {inputs.map((input, index) => {
                    return <Input
                        key={index}
                        value={formData[input.name] || ''}
                        onChange={handleChange}
                        {...input}
                    />
                })}

                {bottom}
            </div>
            <div className="button-container">
                {buttons.map((button, index) => {
                    return <Button key={index}  {...button} />
                })}
            </div>
        </form>
    );
}

export default Form;