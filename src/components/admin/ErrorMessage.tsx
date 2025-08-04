import React from "react";

type Props = {
	message?: string;
};

const ErrorMessage: React.FC<Props> = ({ message }) => {
	if (!message) return null;

	return (
		<div>
			<p className="text-sm text-red-600">{message}</p>
		</div>
	);
};

export default ErrorMessage;
