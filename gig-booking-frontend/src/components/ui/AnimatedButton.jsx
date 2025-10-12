export default function AnimatedButton({ children, onClick, type = "button" }) {
    return (
      <button className="animated-button" onClick={onClick} type={type}>
        {children}
      </button>
    );
  }
  