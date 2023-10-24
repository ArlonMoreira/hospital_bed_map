import React from 'react'
//styles
import styles from './ProgressBar.module.css';

type Props = {
  value: number
}

const ProgressBar = ({value}: Props) => {
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.content}`}>
          <div className={`${styles.progressAnimation}`} style={{width: `${value}%`}}>
            <div className={`${styles.label}`}>
              {value.toFixed(0)}%
            </div>
          </div>
      </div>
    </div>
  )
};

export default ProgressBar;