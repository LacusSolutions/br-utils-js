import { describeType as baseDescribeType } from './describe-type';
import { escapeHTML as baseEscapeHTML } from './escape-html';
import { generateRandomSequence as baseGenerateRandomSequence } from './generate-random-sequence';

const lacusUtils = Object.freeze({
  describeType: baseDescribeType,
  escapeHTML: baseEscapeHTML,
  generateRandomSequence: baseGenerateRandomSequence,
});

export default lacusUtils;
