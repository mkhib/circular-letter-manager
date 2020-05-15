import React from 'react';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      direction: 'ltr',
    },
    label: {
      fontFamily: 'FontNormalFD',
    },
    button: {
      marginRight: theme.spacing(1),
      fontFamily: 'FontNormalFD',
    },
    stepper: {
      fontFamily: 'FontNormalFD',
      direction: 'rtl',
    },
    instructions: {
      marginTop: theme.spacing(1),
      fontFamily: 'FontNormalFD',
      marginBottom: theme.spacing(5),
    },
  }),
);

const StepLabelFD = withStyles((theme: Theme) => ({
  label: {
    fontFamily: 'FontNormalFD',
  },
}))(StepLabel);

const StepperLabelFD = withStyles((theme: Theme) => ({
  root: {
    fontFamily: 'FontNormalFD',
  },
}))(Stepper);

function getSteps() {
  return ['وارد کردن مشخصات بخشنامه', 'بارگذاری فایل‌ها', 'تایید اطلاعات'];
}
function customStepLabel(step: number, labels: Array<string>) {
  switch (step) {
    case 0:
      return `${labels[0]}`;
    case 1:
      return `${labels[1]}`;
    case 2:
      return `${labels[2]}`;
    default:
      return 'Unknown step';
  }
}
function getStepContent(step: number) {
  switch (step) {
    case 0:
      return '.مشخصات بخشنامه را وارد نمایید';
    case 1:
      return '.فایل‌های خود را انتخاب کنید';
    case 2:
      return '.اطلاعات ورودی را کنترل نمایید';
    default:
      return 'Unknown step';
  }
}

export default function HorizontalLinearStepper(props: any) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const steps = getSteps();

  const isStepOptional = (step: number) => {
    return step === 10;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
    return activeStep;
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <StepperLabelFD activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabelFD {...labelProps}>{label}</StepLabelFD>
            </Step>
          );
        })}
      </StepperLabelFD>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              {props.customLastStep ? props.customLastStep : 'بخشنامه با موفقیت به ثبت رسید.'}
            </Typography>
            <Button
              disabled={props.returnDisabled ? props.returnDisabled : false}
              //  onClick={handleReset} 
              href={props.returnHref ? props.returnHref : '/'}
              className={classes.button}>
              بازگشت
            </Button>
          </div>
        ) : (
            <div className={classes.stepper}>
              <Typography className={classes.instructions}>{(props.customLabels && customStepLabel(activeStep, props.customLabels)) || getStepContent(activeStep)}</Typography>
              {props.children}
              <div style={{ marginBottom: 30, marginTop: 10 }}>
                <Button disabled={props.backDisabled || activeStep === 0} onClick={() => {
                  handleBack();
                  props.getPreviousStep(activeStep - 1);
                }
                } className={classes.button}>
                  مرحله قبل
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={props.disabled}
                  onClick={() => {
                    handleNext();
                    props.getNextStep(activeStep + 1);
                    props.onNext(activeStep);
                  }}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'ثبت' : 'مرحله بعد'}
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}