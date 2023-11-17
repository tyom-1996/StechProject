import * as React from "react"

const SvgComponent = (props) => (
    <svg
        width={40}
        height={37}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="m20 0 4.49 13.82h14.531l-11.756 8.54 4.49 13.82L20 27.64 8.244 36.18l4.49-13.82L.98 13.82h14.53L20 0Z"
            fill="#F60"
        />
    </svg>
)

export default SvgComponent
