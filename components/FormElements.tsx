
import React from 'react';
import { useTheme } from './ThemeManager';

// --- Icons ---
export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

export const RefreshCwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

export const CogIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-.962a8.25 8.25 0 0 1 .966.086c.537.096.963.547.963 1.098l0 .001c.009.05.022.099.039.146.052.145.118.284.199.415.099.162.22.31.359.444.139.133.298.249.47.349.155.088.325.16.502.214.17.051.347.086.527.107.566.068 1.06.484 1.123 1.05l0 .001c.003.011.004.022.005.033.004.04.006.08.006.12l0 .001c0 .009-.001.019-.001.028a8.35 8.35 0 0 1-.027.217c-.029.22-.076.434-.14.641a.999.999 0 0 1-.188.49c-.092.161-.202.309-.332.441a.999.999 0 0 1-.42.312c-.19.09-.393.163-.604.216-.19.048-.39.08-.593.098-.572.052-1.026.45-1.048.968l0 .001c-.001.005-.001.01-.002.015v.002c0 .005 0 .01.001.015l0 .001c.021.485.327.901.766 1.088l.006.002a8.175 8.175 0 0 0 1.016.255c.018.002.035.006.053.008l.005.001a7.5 7.5 0 0 1-11.906 0l.005-.001c.018-.002.035-.006.053-.008l.006-.002a8.175 8.175 0 0 0 1.016-.255c.439-.187.745-.603.766-1.088l0-.001v-.001a.04.04 0 0 0 .001-.015v-.002a.04.04 0 0 0-.002-.015l0-.001c-.022-.519-.476-.916-1.048-.968-.203-.018-.402-.05-.593-.098-.21-.053-.414-.126-.604-.216a1 1 0 0 1-.42-.312c-.13-.132-.24-.28-.332-.441a1 1 0 0 1-.188-.49c-.064-.207-.111-.422-.14-.641a8.35 8.35 0 0 1-.027-.217A.044.044 0 0 1 4.001 12l0-.001c0-.04.002-.08.006-.12a.038.038 0 0 0 .005-.033l0-.001c.063-.566.557-.982 1.123-1.05.18-.021.357-.056.527-.107.177-.054.347-.127.502-.214.172-.1.33-.216.47-.349.139-.133.26-.282.359-.444.081-.13.147-.27.199-.415.017-.047.03-.096.039-.146l0-.001c0-.551.426-1.002.963-1.098a8.25 8.25 0 0 1 .966-.086c.55-.041 1.02.42 1.11.962Z M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
    </svg>
);


// --- Form Elements ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', leftIcon, rightIcon, className, ...props }) => {
  const { styles } = useTheme();
  
  const baseClasses = `inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md transition-colors duration-150`;
  
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = `${styles.buttonPrimaryBg} ${styles.buttonPrimaryText} ${styles.buttonPrimaryBorder} ${styles.buttonPrimaryShadow}`;
  } else {
    variantClasses = `${styles.buttonSecondaryBg} ${styles.buttonSecondaryText} ${styles.buttonSecondaryBorder}`;
  }

  let sizeClasses = '';
  if (size === 'sm') sizeClasses = 'px-2.5 py-1.5 text-xs';
  else if (size === 'md') sizeClasses = 'px-4 py-2 text-sm';
  else if (size === 'lg') sizeClasses = 'px-6 py-3 text-base';

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className || ''}`} {...props}>
      {leftIcon && <span className="mr-2 -ml-1 h-5 w-5">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 -mr-1 h-5 w-5">{rightIcon}</span>}
    </button>
  );
};


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  const { styles } = useTheme();
  const baseClasses = `block w-full text-sm rounded-md shadow-sm focus:ring-opacity-50`;
  const styleClasses = `${styles.inputBg} ${styles.inputText} ${styles.inputBorder} ${styles.inputPlaceholder}`;
  
  return <input className={`${baseClasses} ${styleClasses} ${className || ''}`} {...props} />;
};


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
}
export const Select: React.FC<SelectProps> = ({ children, className, containerClassName, ...props }) => {
  const { styles } = useTheme();
  const baseClasses = `block w-full text-sm rounded-md shadow-sm focus:ring-opacity-50 appearance-none`;
  const styleClasses = `${styles.inputBg} ${styles.inputText} ${styles.inputBorder} ${styles.inputPlaceholder}`;

  return (
    <div className={`relative ${containerClassName || ''}`}>
      <select className={`${baseClasses} ${styleClasses} pr-8 ${className || ''}`} {...props}>
        {children}
      </select>
      <ChevronDownIcon className={`w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${styles.iconColor}`} />
    </div>
  );
};


interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className, id, ...props }) => {
  const { styles } = useTheme();
  const baseClasses = `h-4 w-4 rounded text-blue-600 focus:ring-blue-500`; // Tailwind's default blue, color comes from text-blue-600
  const styleClasses = `${styles.inputBorder}`; // Using input border for consistency
  
  return (
    <div className="flex items-center">
      <input type="checkbox" id={id} className={`${baseClasses} ${styleClasses} ${className || ''}`} {...props} />
      {label && <label htmlFor={id} className={`ml-2 text-sm ${styles.textSecondary}`}>{label}</label>}
    </div>
  );
};

interface RadioGroupProps {
  name: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  inline?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, selectedValue, onChange, inline }) => {
  const { styles } = useTheme();
  return (
    <div className={`flex ${inline ? 'flex-row space-x-4' : 'flex-col space-y-2'}`}>
      {options.map(option => (
        <div key={option.value} className="flex items-center">
          <input
            id={`${name}-${option.value}`}
            name={name}
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            className={`h-4 w-4 text-blue-600 ${styles.inputBorder} focus:ring-blue-500`}
          />
          <label htmlFor={`${name}-${option.value}`} className={`ml-2 text-sm ${styles.textSecondary}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title }) => {
  const { styles } = useTheme();
  return (
    <div className={`${styles.cardBg} ${styles.cardBorder} ${styles.cardShadow} rounded-lg ${className || ''}`}>
      {title && (
        <div className={`px-4 py-3 border-b ${styles.tableBorder}`}>
          <h3 className={`text-lg font-medium leading-6 ${styles.textPrimary}`}>{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

