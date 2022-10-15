const AccordionItem = () => {
  <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1bh-content"
      id="panel1bh-header"
    >
      <Typography sx={{ width: '33%', flexShrink: 0 }}>
        General settings
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography>
        Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
        Aliquam eget maximus est, id dignissim quam.
      </Typography>
    </AccordionDetails>
  </Accordion>
}

export default AccordionItem