import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

const correctOTP = "MEOW";

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const yesButtonSize = noCount * 10 + 16;

  const handleNoClick = () => {
    setNoCount(noCount + 1);
  };

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "Are you sure?",
      "What if I asked really nicely?",
      "Pretty please",
      "With a chocolate rice cake on top",
      "What about a matcha frostie",
      "PLEASE MUFFIN",
      "But :*(",
      "Baat nahi karo tum",
      "Meri baat suno",
      "I love you",
      "please babe",
      ":((((",
      "PRETTY PLEASE",
      "say yesssss",
      "No :(",
    ];

    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const numberOfDigits = 4;
  const [otp, setOtp] = useState<string[]>(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState<string | null>(null);
  const otpBoxReference = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    value = value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1]?.focus();
    }
  };

  const handleBackspaceAndEnter = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      otpBoxReference.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && e.currentTarget.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    if (otp.join("") !== "" && otp.join("") !== correctOTP && otp.join('').length == 4) {
      setOtpError("❌ What did I say first stupid?");
    } else {
      setOtpError(null);
    }
  }, [otp]);

  if(otp.join("") !== correctOTP) {
    return (
        <article className={styles.otpInputWithValidation}>
          <p className={styles.otpDescription}>Top Secret Mission - Verification</p>
          <p className={styles.otpInfo}>How did we meet?</p>
    
          <p className={styles.otpLabel}>Authentication code</p>
    
          <div className={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                ref={(ref) => (otpBoxReference.current[index] = ref)}
                className={styles.otpInput}
              />
            ))}
          </div>
    
          <p className={`${styles.otpError} ${otpError ? styles.errorShow : ''}`}>{otpError}</p>
        </article>
      );
  }

  return (
    <div className={styles.page}>
      {yesPressed ? (
        <>
          <Image width={250} alt='bear' src={require('../../../public/images/you1.gif')} />
          <div className={`${styles.my} ${styles.text4xl} ${styles.fontBold}`}>WOOOOOO!!! I love you muffinnnnnn!! ;))</div>
        </>
      ) : (
        <>
          <Image
            alt='bear'
            width={250}
            src={require('../../../public/images/you2.gif')}
          />
          <h1 className={`${styles.my} ${styles.text4xl}`}>Will you be my Valentine?</h1>
          <div className={styles.buttonContainer}>
            <button
              className={`${styles.yesButton} ${styles.fontBold}`}
              style={{ fontSize: yesButtonSize }}
              onClick={() => setYesPressed(true)}
            >
              Yes
            </button>
            <button
              className={`${styles.noButton} ${styles.fontBold}`}
              onClick={handleNoClick}
            >
              {noCount === 0 ? "No" : getNoButtonText()}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
