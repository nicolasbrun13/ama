import { Logger } from '@nestjs/common';

// Les tests provoquent volontairement des erreurs (SMTP, refund) : on coupe les logs Nest.
Logger.overrideLogger(false);
