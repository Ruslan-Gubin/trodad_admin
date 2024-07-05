import { AddPhotoCircleSvg } from "./AddPhotoCircleSvg";
import { AddPhotoSvg } from "./AddPhotoSvg";

//@ts-ignore
import styles from "./AddMedia.module.scss";


type AddMediaProps = {
  description: string;
  size: "lg" | "sm";
  accept?: string;
  changeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement>;
};

const AddMedia = (props: AddMediaProps) => {
  const { fileRef, changeFile, description, size, accept = "image/*" } = props;

  return (
    <div className={size === 'sm' ? `${styles.root} ${styles.smallSize}` :  styles.root} >
      <div
        className={
          size === "lg"
            ? `${styles.add_file}`
            : `${styles.add_file} ${styles.more_file}`
        }
       
      >
        <AddPhotoSvg />
        <input
          type="file"
          accept={accept}
          onChange={changeFile}
          ref={fileRef}
          hidden
          />
      </div>
      <div 
       onClick={() => fileRef.current?.click()}
      className={styles.addMediaContainer}
      >
          <AddPhotoCircleSvg/>
          {size === "lg" && <p className={styles.addMediaText}>{description}</p>}
      </div>
    </div>
  );
};

export { AddMedia };
