interface TextInputProps{
    label: string;
    defaultValue: string;
    type?: string;
    placeholder?: string;
}

const TextInput = ({label, defaultValue, placeholder, type="text"}: TextInputProps ) => {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
      />
    </div>
  );
};

export default TextInput;
