import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";

interface TimePickerProps {
	value: string;
	disabled?: boolean;
	onChange: (value: moment.Moment) => void;
	width?: string;
	height?: string;
	borderRadius?: string;
	padding?: string;
	backgroundColor?: string;
}
export default function MuiTimePicker({
	value,
	disabled = false,
	onChange,
	width = "140px",
	height = "32px",
	borderRadius = "6px",
	padding = "8.5px",
	backgroundColor = "rgba(255,255,255,0.1)",
}: TimePickerProps) {
	return (
		<TimePicker
			value={value ? moment(value, "HH:mm") : null}
			disabled={disabled}
			onChange={onChange}
			slotProps={{
				textField: {
					size: "small",
					sx: {
						width: width,
						height: height,
						"& .MuiPickersInputBase-root": {
							fontSize: "0.875rem",
							backgroundColor: backgroundColor,
							borderRadius: borderRadius,
							color: "#fff",
							"&.Mui-disabled": {
								color: "#fff",
								WebkitTextFillColor: "#fff",
								opacity: 1,
							},
						},
						"& .MuiPickersSectionList-root.MuiPickersInputBase-sectionsContainer":
							{
								padding: padding,
							},
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: "rgba(255,255,255,0.05)",
						},
					},
				},
				popper: {
					sx: {
						"& .MuiMultiSectionDigitalClockSection-root": {
							scrollbarWidth: "none",
							msOverflowStyle: "none",
							"&::-webkit-scrollbar": {
								display: "none",
							},
						},
						"& .MuiList-root": {
							backgroundColor: "#1a212e",
						},
						"& .MuiMenuItem-root": {
							"&.Mui-selected": {
								backgroundColor: "#2cedb3",
								color: "#fff",
							},
							color: "#fff",
						},
						"& .MuiDialogActions-root": {
							backgroundColor: "#1a212e",
						},
					},
				},
			}}
		/>
	);
}
