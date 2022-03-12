import sys

sys.path.append(".")

from main.model.bpmn.generate_model import parse_bpmn
from main.model.bpmn.svg_to_png import convert

if __name__ == "__main__":
    parse_bpmn()
    convert()
